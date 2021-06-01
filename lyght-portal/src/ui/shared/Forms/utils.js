import { compressAccurately } from 'image-conversion';

export const identityImgOptimizer = (file) => {
  return compressAccurately(file, {
    size: 200,
    height: 512,
    accuracy: 0.9,
    type: 'image/jpeg',
  });
};

export const profileImgOptimizer = (file) => {
  return compressAccurately(file, {
    size: 100,
    height: 512,
    accuracy: 0.9,
    type: 'image/jpeg',
  });
};
