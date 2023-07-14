#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd public

# 如果是发布到自定义域名
echo 'www.libertinelym.top' > CNAME

git init
git add -A
# 每次发布修改这里的提交信息
git commit -m '前端规范'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/LiyumingBen/LiyumingBen.github.io.git master

cd -