![流程图](D:\UGit\front-end-learning-record\9、git相关操作\流程图.png)

- Workspace：工作区
- Index / Stage：暂存区
- Repository：仓库区（或本地仓库）
- Remote：远程仓库
- 关键词：Git是分布式版本控制系统，每个人的电脑就是一个完整的版本库



# 常见命令

- git clone：克隆远程仓库
- git add：提交到暂存区
- git diff：比较暂存区和工作区区别
- git commit：暂存区=>本地仓库
- git pull：拉取远程代码并合并
- git push：推送代码到远程并合并
- git stash：缓存暂存区和工作区的改动，保存在一个栈上面



## fork、clone、branch

- fork：复制一份代码到远程仓库，远程仓库是你自己。可以通过pull request贡献给原仓库
- clone：复制一份代码到你自己的仓库，远程仓库是clone的仓库。
- branch：新开分支。

## pull、fetch

- pull：拉取远程仓库最新内容并直接合并。git pull = git fetch + git merge。
- fetch：拉取远程仓库最新内容，用户检测之后决定是否合并到本机分支。

## rebase、merge

- rebase：`rebase`会将整个分支移动到另一个分支上，有效地整合了所有分支上的提交。主要的好处是历史记录更加清晰，是在原有提交的基础上将差异内容反映进去，消除了 `git merge`所需的不必要的合并提交
- merge：通过`merge`合并分支会新增一个`merge commit`，然后将两个分支的历史联系起来。其实是一种非破坏性的操作，对现有分支不会以任何方式被更改，但是会导致历史记录相对复杂

## reset、revert

- reset：回退版本，**遗弃**提交
- revert：新增一次提交，抵消上一次提交导致的变化

> git revert是用一次逆向的commit“中和”之前的提交，因此日后合并老的branch时，之前提交合并的代码仍然存在，导致不能够重新合并
>
> 但是git reset是之间把某些commit在某个branch上删除，因而和老的branch再次merge时，这些被回滚的commit应该还会被引入

### reset
1. 常见用法
    - git reset --soft HEAD~1 （用于撤销commit到本地，还没push的提交）

2. 参数详解
 1. --mixed：不删除工作空间改动代码，撤销commit，并且撤销git add . ，为默认参数,git reset --mixed HEAD^ 和 git reset HEAD^ 效果是一样的。
 2. --soft：不删除工作空间改动代码，撤销commit，不撤销git add . 
 3. --hard：删除工作空间改动代码，撤销commit，撤销git add . ，注意完成这个操作后，就恢复到了上一次的commit状态。
 4. HEAD^的意思是上一个版本，也可以写成HEAD~1，如果你进行了2次commit，想都撤回，可以使用HEAD~2

- 那么如何撤销已经推送到远程分支的代码呢？
    1. git reset –-soft 或者 git reset –-hard (即本地先回滚)
    2. git push origin 分支名 --force (强制把本地分支推送上去)
