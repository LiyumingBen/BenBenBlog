var logsFunc = function(version) {
  if(typeof window !== 'undefined') {
    console.log(`%c %c\n当你还配不上你的野心时\请静下心来努力\别辜负了曾经所受的苦难✌🏻\n%c 记录生活点滴 %c 当前版本：${version}`,
      ` padding: 25px 200px;
        background-image: url('https://pic1.58cdn.com.cn/nowater/fangfe/n_v291c36487fef1413eb9f62fc789eba2c6.jpg');
        background-size: contain;
        background-repeat: no-repeat;
        color: transparent;`, 
      'color: #3eaf7c; font-size: 16px;margin-bottom: 10px;',
      'background: #35495e; padding: 4px; border-radius: 3px 0 0 3px; color: #fff', 
      'background: #41b883; padding: 4px; border-radius: 0 3px 3px 0; color: #fff',
    );
  }
}

export default logsFunc;