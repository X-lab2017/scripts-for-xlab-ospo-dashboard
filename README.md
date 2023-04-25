# X-lab OSPO 大屏数据制作脚本
相关 Issue：https://github.com/X-lab2017/open-wonderland/issues/250

大屏链接：https://dataease.nzcer.cn/link/N1fjcnVD

<img width="1920" alt="image" src="https://user-images.githubusercontent.com/32434520/234217503-feed073a-6e8e-4182-9366-2a837e82cd89.png">

## 如何半自动化更新大屏
制作该大屏依赖 @zhicheng-ning 为 X-lab XSOSI 大屏制作的数据，每个月需要等志成把 XSOSI 大屏更新后，再来更新 OSPO 大屏。


1、安装依赖

```bash
yarn install
```

2、登录 X-lab 语雀空间并获取 _yuque_session

访问 [X-lab 语雀空间统计页面](https://xlab2017.yuque.com/r/organizations/dashboard/statistics)，在登录状态后，打开浏览器控制台，获取 Cookies 中 `_yuque_session` 的值（如下图所示）。

<img width="1741" alt="image" src="https://user-images.githubusercontent.com/32434520/234220667-45f59150-8cd5-44c1-ad0b-f2e0f8a8af14.png">

3、运行脚本，生成数据表

脚本会读取环境变量 `YUQUE_SESSION`，所以运行脚本前先设置环境变量。

```bash
YUQUE_SESSION="上面获取的 _yuque_session" ts-node index.ts
```

不出意外的话，运行后会在`/sheets`目录下得到 4 个 Excel 表格。

4、登录 DataEase 管理界面，替换数据表

逐个替换即可。

<img width="1740" alt="image" src="https://user-images.githubusercontent.com/32434520/234222708-5c3cb14c-9787-493b-a402-2f78ceae808f.png">

5、设置最新月份为默认值

最后需要编辑大屏，改一下文本下拉组件的默认值为最新的月份。

<img width="1740" alt="image" src="https://user-images.githubusercontent.com/32434520/234223045-749b962c-d7e7-45cf-8773-3842ad10276b.png">

## 如何添加 OpenDigger 指标明细表中的列
OpenDigger可能会生产更多的指标，如果要把新指标也加进来，可以修改`const.ts`中的`OPENDIGGER_METRICS_FOR_REPO`。

## 如何添加开源论文发表信息
请修改`x-lab-open-source-papers.json`文件。欢迎提 PR 到这个仓库。