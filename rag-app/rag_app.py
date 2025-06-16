import os
import warnings
import tempfile
from dotenv import load_dotenv
from supabase import create_client
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tiktoken
from langchain_ollama import OllamaEmbeddings
import faiss
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain import hub

load_dotenv()

SUPABASE_URL = "https://zxwcmdtglqgzipdkhusv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4d2NtZHRnbHFnemlwZGtodXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzMxMDcsImV4cCI6MjA2MDEwOTEwN30.PAaDWe_joel3V21a3kJDy8gfikXLwJUaQVA80K0bI7g"
STORAGE_BUCKET = "knowledge-pdf"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def download_pdfs_from_supabase():
    pdfs = []
    files = supabase.storage.from_(STORAGE_BUCKET).list()
    output_dir = "downloaded_pdfs"
    os.makedirs(output_dir, exist_ok=True)

    for file in files:
        if file["name"].endswith(".pdf"):
            response = supabase.storage.from_(STORAGE_BUCKET).download(file["name"])
            file_path = os.path.join(output_dir, file["name"])
            with open(file_path, "wb") as f:
                f.write(response)

            # print(f"Saved: {file_path}")

            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
                tmp_pdf.write(response)
                tmp_pdf.flush()

                loader = PyMuPDFLoader(tmp_pdf.name)
                temp_docs = loader.load()
                pdfs.extend(temp_docs)

            os.remove(tmp_pdf.name)

    return pdfs

def split_documents(pdfs):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    return text_splitter.split_documents(pdfs)

def embed_documents(chunks):
    embeddings = OllamaEmbeddings(model='nomic-embed-text', base_url='http://localhost:11434')
    vector = embeddings.embed_query("Hello World")

    index = faiss.IndexFlatL2(len(vector))
    vector_store = FAISS(
        embedding_function=embeddings,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={},
    )

    ids = vector_store.add_documents(documents=chunks)
    return vector_store

def search_documents(vector_store, question):
    docs = vector_store.search(query=question, k=5, search_type="similarity")
    return docs

def format_docs(docs):
    return '\n\n'.join([doc.page_content for doc in docs])

def initialize_rag_chain(retriever, prompt_template, llm):
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt_template
        | llm
        | StrOutputParser()
    )
    return rag_chain

def ask_question(rag_chain, question):
    return rag_chain.invoke(question)

def main():
    pdfs = download_pdfs_from_supabase()

    chunks = split_documents(pdfs)

    vector_store = embed_documents(chunks)

    question = "dimana kah universitas prasetiya mulya?"
    docs = search_documents(vector_store, question)

    prompt = """
        You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question.
        If you don't know the answer, just say that you don't know.
        Please use sentence only to answer
        Question: {question} 
        Context: {context} 
        Answer:
    """
    prompt_template = ChatPromptTemplate.from_template(prompt)
    llm = ChatOllama(model='gemma3:4b', base_url='http://localhost:11434')
    
    rag_chain = initialize_rag_chain(vector_store.as_retriever(search_type='similarity', search_kwargs={'k': 50}), prompt_template, llm)
    response = ask_question(rag_chain, question)
    print(response)

if __name__ == "__main__":
    main()
