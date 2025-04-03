import {create} from 'zustand';
import {API_URL} from "@/environment";
import {User} from "@/types/auth.types";
import APIResponse from "@/types/APIResponse";

interface AuthStore {
  user: User | null;
  isLoadingUser: boolean;
  loadUser: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoadingUser: false,

  loadUser: async () => {
    set({ isLoadingUser: true });
    try {
      const response = await fetch(`${API_URL}/v1/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      const apiResponse: APIResponse<User> = await response.json();
      if (!response.ok || !apiResponse.data || !apiResponse.success) throw new Error(apiResponse.message);

      set({ user: apiResponse.data });
    } catch (e) {
      console.error((e as Error).message || "Failed to load user.");
      set({ user: null});
    } finally {
      set({ isLoadingUser: false });
    }
  }
}));

export default useAuthStore;