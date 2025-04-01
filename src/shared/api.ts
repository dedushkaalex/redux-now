import * as z from "zod";

const baseUrl = "http://localhost:3000";

const UserDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});
export const api = {
  getUsers: async () => {
    return fetch(`${baseUrl}/users`)
      .then((r) => r.json())
      .then((res) => {
        return UserDTOSchema.array().parse(res);
      });
  },
  getUser: async (id: string) => {
    return fetch(`${baseUrl}/users/${id}`)
      .then((r) => r.json())
      .then((res) => {
        return UserDTOSchema.parse(res);
      });
  },
  deleteUser: async (id: string) => {
    return fetch(`${baseUrl}/users/${id}`, { method: "DELETE" }).then((r) =>
      r.json()
    );
  },
};
