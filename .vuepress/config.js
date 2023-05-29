module.exports = {
  title: "KKlife",
  description: "Just playing around",
  dest: './dist',
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  permalink: "/:year/:month/:day/:slug", // 永久链接
  theme: 'reco',    // 主题类型

  // 语言配置
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },

  themeConfig: {

    // 指定首页路径
    base: '/',

    // ===========================  基本信息  ===========================
    logo: "/logo.jpg",
    author: "Koray",
    authorAvatar: "/logo2.jpg",
    startYear: '2021',                  // blog开始时间
    lastUpdated: 'Last Updated',        // 文章最后更新时间
    subSidebar: 'auto',                 // 自动生成右侧边栏

    // 备案信息
    record: 'ICP备案文案',
    recordLink: 'ICP备案指向链接',
    cyberSecurityRecord: '公安部备案文案',
    cyberSecurityLink: '公安部备案指向链接',
    noFoundPageByTencent: false,  // 关闭404腾讯页面

    // 搜索设置
    search: true,
    searchMaxSuggestions: 5,

    // 暗亮模式
    mode: 'light',     // 初始模式[auto,dark,light] 
    modePicker: true,  // 显示模式调节按钮



    // ===========================  首页博客信息  ===========================
    type: 'blog',
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'Tag' // 默认 “标签”
      },
      socialLinks: [     // 信息栏展示社交信息
        { icon: 'reco-github', link: 'https://github.com/kekoray' },
      ]
    },


    // ===========================  导航栏  ===========================
    // icon选项：https://fontawesome.com/icons?d=gallery&m=free
    nav: [
      { text: 'Home', link: '/', icon: 'reco-home' },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
      {
        text: 'Docs',             // 导航栏按钮
        icon: 'reco-message',     // 按钮图标
        items: [                  // 按钮的下拉框选型
          { text: 'vuepress-reco', link: '/docs/theme-reco/' },
          { text: 'vuepress2', link: '/docs/theme-reco/' }
        ]
      },
      {
        text: 'Contact',
        icon: 'reco-message',
        items: [
          { text: 'GitHub', link: 'https://github.com/recoluan', icon: 'reco-github' }
        ]
      }
    ],

    sidebar: {
      '/docs/theme-reco/': [
        '',
        'theme',
        'plugin',
        'api'
      ]
    },





    // ===========================  首页友链信息  ===========================
    friendLink: [
      {
        title: 'koray',
        desc: 'Enjoy when you can, and endure when you must.',
        email: 'kekoray@qq.com',
        link: 'https://koray2021.xyz/'
      },
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://vuepress-theme-reco.recoluan.com'
      },
    ],


    // ===========================  登录加密  ===========================
    //  keyPage: {
    //   keys: ['32位的 md5 加密密文'], // 1.3.0 版本后需要设置为密文
    //   color: '#42b983', // 登录页动画球的颜色
    //   lineColor: '#42b983' // 登录页动画线的颜色
    // },

    /**
     * valine 设置 (if you need valine comment )
    */
    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
  },

  markdown: {
    lineNumbers: true
  },

  // ===========================  插件工具  ===========================
  plugins: [
    // 谷歌统计: https://analytics.google.com/analytics/web/
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-269686917-1'
      }
    ],
    // 全文搜索
    ['flexsearch-pro',
      {
        searchPaths: [],          // 搜索路径数组，为空表示搜索全部路径
        searchHotkeys: ['f'],      // 激活搜索控件的热键
        searchResultLength: 60,    //  搜索结果展示的字符长度
      }
    ],
    // 复制提示
    ['vuepress-plugin-code-copy', {
      color: '#d6e4f4',
      backgroundTransition: true,
      backgroundColor: '#D7D7D7',
      successText: 'OK!'
    }],
    // 复制添加著作权信息
    ['copyright', {
      authorName: 'Koray',   // 选中的文字将无法被复制
      minLength: 10,       // 如果长度超过10个字符
    }],
    // 动态标题
    ['dynamic-title', {
      showIcon: '/logo.jpg',
      showText: '(/≧▽≦/)咦！又好了！',
      hideIcon: '/logo.jpg',
      hideText: '(●—●)喔哟，崩溃啦！',
      recoverTime: 2000,
    }],
    // 公告栏弹窗
    //  ['@vuepress-reco/vuepress-plugin-bulletin-popover', {
    //   width: '300px', // 默认 260px
    //   title: '消息提示',
    //   body: [
    //     {
    //       type: 'title',
    //       content: '添加冴羽好友入前端交流群',
    //       style: 'text-aligin: center;'
    //     },
    //     {
    //       type: 'image',
    //       src: 'https://cdn.jsdelivr.net/gh/mqyqingfeng/picture/IMG_3516.JPG'
    //     }
    //   ],
    //   footer: [
    //     {
    //       type: 'button',
    //       text: '打赏',
    //       link: '/donate'
    //     } 
    //   ]
    // }]
  ]

}  
