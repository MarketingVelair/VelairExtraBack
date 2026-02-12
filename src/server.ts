import app from "./app";
import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

/*
webpush.setVapidDetails(
    'mailto:admin@yourapp.com',
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);
*/

declare global {
  interface Console {
    devlog: (...args: any[]) => void;
  }
}
console.devlog = (...args:any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args); // spread the args
  }
};
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
