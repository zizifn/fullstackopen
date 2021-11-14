import { config } from 'dotenv';

config();

const PORT = process.env.PORT;


// await new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('test');
//     }, 2000);
// });

console.log('end of test module');

export default PORT;