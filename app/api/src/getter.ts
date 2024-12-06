import { OrderItem, OrderItem_OrderType } from './generated/Base';


const url = 'http://localhost/';
let mp3Links: string[] = [];
const addUrl = "http://172.20.0.1/"
// const addUrl = "http://172.20.240.1"

export async function getMp3Links() {
  let orderList: OrderItem[] = []

  const files = ["1.mp3", "2.mp3", "3.mp3", "4.mp3", "5.mp3", "6.mp3"];
  for (const a of files) {
    console.log(addUrl + a);
    orderList.push({ useStream: false, taskName: a, url: addUrl + a, type: OrderItem_OrderType.FILE })
  }
  return orderList;

  try {
    // 使用 fetch 获取页面内容
    const response = await fetch(url);
    const data = await response.text();

    // 正则表达式匹配 .mp3 文件的链接
    const regex = /href="([^"]+\.mp3)"/g;


    let match;
    while ((match = regex.exec(data)) !== null) {
      // 提取链接并拼接成完整的 URL
      mp3Links.push(addUrl + match[1]);
    }

    // 打印所有 mp3 文件链接
    console.log('MP3 文件链接:');
    mp3Links.forEach(link => {
      console.log(link);
      orderList.push({ useStream: false, taskName: link, url: link, type: OrderItem_OrderType.FILE })
    });
  } catch (error) {
    console.error('Error fetching the page:', error);
  }
  return orderList;
}
