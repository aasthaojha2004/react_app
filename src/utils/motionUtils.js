// src/utils/motionUtils.js

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export const exitFade = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
