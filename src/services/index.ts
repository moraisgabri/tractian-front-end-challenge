export const apiRequest = async (route: string, id?: string) => {
  const response = await fetch(`api/${route}${id ? `/${id}` : ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response) {
    return response.json();
  }
};
