import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: 'your_clound_name',
      api_key: '937741153146827',
      api_secret: '4a8OvVMUBzTh1QgV8BDqZ_5LZKI',
    });
  },
};
