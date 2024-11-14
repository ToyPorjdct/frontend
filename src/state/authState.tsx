
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const memberInfo = atom({
  key: 'memberInfo',
  default: {
    accessToken: '',
    nickname: '',
    profileImage: '',
    email: '',  
  },
  effects_UNSTABLE: [persistAtom],
});
