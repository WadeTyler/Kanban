import {create} from 'zustand';
import {User} from "@/types/auth.types";
import {APIResponse} from "@/types/APIResponse.types";
import {http} from "@/lib/http.config";

interface AuthStore {
  user: User | null;
  isLoadingUser: boolean;
  loadUser: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoadingUser: true,

  loadUser: async () => {
    set({isLoadingUser: true});
    await http.get<APIResponse<User>>('/v1/auth')
      .then((apiResponse) => {
        set({user: apiResponse.data});
      })
      .catch(() => {
        set({user: null});
      })
      .finally(() => {
        set({isLoadingUser: false});
      });
  }
}));

export default useAuthStore;