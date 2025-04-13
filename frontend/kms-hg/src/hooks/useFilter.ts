import { useState } from "react";

export function useFilter(defaultFields = "Fields", defaultType = "Type") {
  const [selectedFields, setSelectedFields] = useState(defaultFields);
  const [selectedType, setSelectedType] = useState(defaultType);
  const [isOpenFields, setIsOpenFields] = useState(false);
  const [isOpenType, setIsOpenType] = useState(false);

  return {
    selectedFields,
    selectedType,
    isOpenFields,
    isOpenType,
    setSelectedFields,
    setSelectedType,
    setIsOpenFields,
    setIsOpenType,
  };
}
