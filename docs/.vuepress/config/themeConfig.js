const nav = require('./themeConfig/nav.js');
const blogConfig = require('./themeConfig/blogConfig.js');
const famousQuotes = require('./themeConfig/famousQuotes.js');
const heroBackgroundImages = require('./themeConfig/heroBackgroundImages.js');
const friendLink = require('./themeConfig/friendLink.js');
const searchThirdparty = require('./themeConfig/searchThirdparty.js');

// 主题配置
module.exports = {
  author: "Ben",
  authorAvatar: "https://avatars.githubusercontent.com/u/17562019?s=400&u=70cae2720ca2798c3076a620623b5d65b056fd19&v=4",
  slogan: 'just do it',
  homeBlogCfg: {
    category: '文章分类',
    categoryNum: 10,
    tag: '热门标签',
    tagNum: 30,
    friendLink: '友情链接',
    friendLinkNum: 5
  },
  lastupdateNum: 3, // 最近更新文章数量
  logo: "https://avatars.githubusercontent.com/u/17562019?s=400&u=70cae2720ca2798c3076a620623b5d65b056fd19&v=4",
  type: "blog", // 已修改源码，默认就是博客
  search: true,
  searchMaxSuggestions: 100,
  lastUpdated: "最近更新时间",
  startYear: "2021",
  cyberSecurityRecord: "笨笨创客工厂",
  version: '1.0.0',
  sidebar: "structuring", // vdoing约定的
  valineConfig: {
    appId: 'iGFJ8EYuYgDrt3NL6Cr3hLR0-gzGzoHsz',// your appId
    appKey: 'aNobcSaLjN0LRHwufO1fFRsm', // your appKey
    showComment: false, // 默认关闭
    placeholder: '填写邮箱可以收到回复提醒哦ヾﾉ≧∀≦)o！！！'
  },
  famousQuotes, // 名言警句
  heroBackgroundImages, // 背景图
  nav, // 导航
  blogConfig, // 设置 socialLinks
  friendLink, // 友链
  searchThirdparty // 第三方搜索链接的搜索框
}
