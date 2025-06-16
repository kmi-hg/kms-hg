from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tempfile
import os
from supabase import create_client
from langchain_ollama import OllamaEmbeddings
import faiss
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from typing import List

app = FastAPI()

class QuestionRequest(BaseModel):
    question: str

load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
STORAGE_BUCKET = "knowledge-pdf"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class QuestionRequest(BaseModel):
    question: str

def download_pdfs_from_supabase():
    pdfs = []
    files = supabase.storage.from_(STORAGE_BUCKET).list()
    output_dir = "KMSHG"
    os.makedirs(output_dir, exist_ok=True)

    for file in files:
        if file["name"].endswith(".pdf"):
            response = supabase.storage.from_(STORAGE_BUCKET).download(file["name"])
            file_path = os.path.join(output_dir, file["name"])
            with open(file_path, "wb") as f:
                f.write(response)

            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
                tmp_pdf.write(response)
                tmp_pdf.flush()

                loader = PyMuPDFLoader(tmp_pdf.name)
                temp_docs = loader.load()
                pdfs.extend(temp_docs)

            os.remove(tmp_pdf.name)
    return pdfs

def split_documents(pdfs):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=100)
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
    docs = vector_store.search(query=question, k=100, search_type="similarity")
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

@app.post("/ask_question")
async def ask_question(request: QuestionRequest):
    question = request.question

    prompt = """
        You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question.
        If you don't know the answer, just say that you don't know.
        Please use sentence only to answer
        Question: {question} 
        Answer:
    """
    prompt_template = ChatPromptTemplate.from_template(prompt)
    formatted_prompt = prompt_template.format(question=question)

    llm = ChatOllama(model='gemma3:4b', base_url='http://localhost:11434')

    response = llm.invoke(formatted_prompt)

    content = response.content

    print(f"AI Content: {content}")

    return {"answer": content}