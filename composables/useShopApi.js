const baseURL = 'http://localhost:3001'; // URL ของ backend Express

export const useShopApi = () => {
  const fetchAll = async () => await $fetch(`${baseURL}/`);
  const fetchOne = async (id) => await $fetch(`${baseURL}/${id}`);
  const create = async (data) => await $fetch(`${baseURL}/`, { method: 'POST', body: data });
  const update = async (id, data) => await $fetch(`${baseURL}/${id}`, { method: 'PUT', body: data });
  const remove = async (id) => await $fetch(`${baseURL}/${id}`, { method: 'DELETE' });

  return { fetchAll, fetchOne, create, update, remove };
};
