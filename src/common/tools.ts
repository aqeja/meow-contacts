import { isAxiosError } from "axios";

export function fullUrl(baseUrl = "", url = "") {
  return baseUrl && !url.startsWith("http") ? `${baseUrl}${url}` : url;
}
export function compareArrays(a: string[], b: string[]) {
  const addedValues = [];
  const removedValues = [];

  // 检查增加的值
  for (let i = 0; i < b.length; i++) {
    if (!a.includes(b[i])) {
      addedValues.push(b[i]);
    }
  }

  // 检查删除的值
  for (let i = 0; i < a.length; i++) {
    if (!b.includes(a[i])) {
      removedValues.push(a[i]);
    }
  }

  // 检查是否相同
  const isSame = addedValues.length === 0 && removedValues.length === 0;

  return {
    isSame,
    addedValues,
    removedValues,
  };
}

export function isNotFoundError(error: any) {
  return isAxiosError(error) && error.response?.status === 404;
}
