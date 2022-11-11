# Orange-ci + TKE实现基于node.js+express前端项目CI/CD

  

##                                                    ----以Saas-edu-Console项目为例

  

## 目标说明

  

实现位于工蜂的前端静态项目CI/CD，并能够由公网访问项目页面。

  

## 涉及工具

  

- win10专业版

- 工蜂

- Orang-ci

- TKE

- node.js+Express

  

## 使用流程

  

1. 用户向Git提交代码，代码中包含Dockerfile，.orange-ci.yml，项目已经配置好orange-ci webhooks

2. 将代码提交到远程仓库

3. 触发Orange-ci自动构建

4. 在Orange-ci的CI Stage中自动编译代码并打包成docker镜像推送到TKE镜像仓库，更新镜像

5. 触发镜像仓库触发器，自动更新使用镜像的服务，完成应用部署

6. 根据vip+端口，或绑定的域名进行公网访问

  

## 实现梗概

  

1. node.js + express应用搭建

2. 配置项目Orange-ci相关项

3. TKE建镜像源，生成并推送镜像到镜像源

4. 容器部署

5. 持续部署

6. 运维

  

## 具体实现

  

### 一、node.js + express应用搭建

  

1. 在根目录下创建一个名为server文件夹，在其中创建名为server.js的文件，内容如下：

  

   ```javascript

   const express = require('express');

   const app = express();

   app.use(express.static('../dist'));

   const port = 80;

   app.listen(port, function (err) {

     if (err) {

       console.log(err);

       return;

     }

   });

   ```

  

   设置express暴露80端口。

  

2. 安装express后在本地进行测试，在server文件路径下执行node server.js，打开lochost:80，若页面加载正确，则应用搭载成功。

  

### 二、配置项目Orange-ci相关项

  

参照文档http://doc.orange-ci.oa.com/quick-start.html ，配置工蜂项目。

  

1. git 仓库授权：允许 Orange-ci 读取仓库中的代码、允许阻塞 Merge Request 、发表评论等，从而达到自动构建和审查代码的目的。

  

   - 打开代码仓库

   - 点击左侧成员（Members）

   - 点击添加成员（Add members），将 orange-ci 添加为 Master 角色

  

2. 配置webhooks：当仓库中的代码变动或者其他事件发生时，通知 Orange-ci服务器，进行相应处理。

  

   - 打开代码仓库

   - 点击设置（Setting）

   - 点击高级设置（Advanced Setting）

   - 点击 Web Hooks

   - Url 处填写 Webhooks 地址：http://orange-ci.oa.com

   - Trigger 处将所有事件全部勾选即可

  

3. 配置.orange-ci.yml：文件中描述了当仓库发生一些事件时，Orange-ci 应该如何去进行处理。通常，约定配置文件命名为 .orange-ci.yml，并且将其存放在项目的根目录下。DEMO的配置文件如下，声明了在某个分支（release）在遇到某个事件（push）的时候，会选择某个镜像源（docker 官方镜像源上的 node 镜像）作为构建环境，依次执行任务（npm install 和 npm run build)。

  

   ```yaml

   release:

    push:

      - network: devnet

        docker:

          image: node:latest

        services:

          - docker

        stages:

          - name: 依赖安装

            script: npm install

          - name: 项目构建

            script: npm run build

   ```

  

4. 编写Dockerfile：docker build更加目录下的Dockerfile进行镜像的构建，以下为Demo

  

   ```dockerfile

   ```

  

### 三、TKE建镜像源，Orange-ci生成并推送镜像到镜像源

  

- 目前Orange-ci支持的Docker源包括：

  1. csighub.tencentyun.com：TencentHub 镜像库，[了解更多](http://csighub.oa.com/) (推荐)

  2. dockerimage.isd.com：ccc 镜像库，[了解更多](http://dockerimage.isd.com/)

  3. docker.oa.com:8080：Gaia 镜像库，[了解更多](http://gaiastack.oa.com/group/images/list)

  4. hub.docker.com： DockerHub 官方镜像库，[了解更多](https://hub.docker.com/)

  5. ccr.ccs.tencentyun.com：腾讯云支撑镜像库

  6. hkccr.ccs.tencentyun.com：腾讯云支撑镜像库，香港

  

​          我们选用ccr.ccs.tencentyun.com：腾讯云支撑镜像库

  

1. 登录TKE控制台：<https://console.cloud.tencent.com/tke2> >，使用新版控制台进行后续操作。

  

2. 开通镜像仓库服务，参考文档<https://cloud.tencent.com/document/product/457/9117>，开通镜像仓库用户名与密码会在后续登录镜像仓库时用到。

  

3. 创建集群：参考文档<https://cloud.tencent.com/document/product/457/32189>，并额外增加一个节点。

  

4. 新建镜像命名空间 路径：镜像仓库--我的镜像--命名空间--新建

  

   ![新建命名空间](https://main.qcloudimg.com/raw/fed49a0490aebd629f9ced12cb2371ef.png)

  

5. 新建镜像仓库 路径：镜像仓库--我的镜像--新建

  

   ![新建镜像仓库](https://main.qcloudimg.com/raw/81246b75b1dd430e77535cfc29911fbf.png)

  

   - 点击新建的镜像仓库名，点击使用指引，可以看到登录镜像源、拉取推送镜像的指令，后续可参考。

  

   ![使用指引](https://main.qcloudimg.com/raw/b13f710dd31769fc515636b5cd02aed4.png)

  

6. 配置.orange-ci.yml：完成登录镜像仓库、生成镜像、推送镜像

  

   ```yaml

   release:

    push:

      - network: devnet

        envFrom: https://git.code.oa.com/mengyaocui/orangeci_test_env/blob/master/env

        docker:

          image: node:latest

        services:

          - docker

        stages:

          - name: 依赖安装

            script: npm install

          - name: 项目构建

            script: npm run build

          - name: 登陆腾讯云镜像

            script: docker login -u $CCR_DOCKER_USER -p $CCR_DOCKER_PWD ccr.ccs.tencentyun.com

          - name: 生成镜像

            script: docker build --network=host -t ccr.ccs.tencentyun.com/saas-edu/saas-edu-console:${ORANGE_COMMIT} ./

          - name: 推送镜像

            script: docker push ccr.ccs.tencentyun.com/saas-edu/saas-edu-console:${ORANGE_COMMIT}

          - name: make message

            script:

              - docker images > message.txt

              - echo "ccr.ccs.tencentyun.com/saas-edu/saas-edu-console:${ORANGE_COMMIT}" >> message.txt

          - name: send message

            type: wework:message

            options:

              fromFile: message.txt

   ```

  

     其中，${ORANGE_COMMIT}为Orange-ci提供的环境变量，值为本次commit id；

  

     其中，登录镜像仓库的用户名（$CCR_DOCKER_USER）与密码（$CCR_DOCKER_PWD）存放在另一个私有项目中，通过https://git.code.oa.com/mengyaocui/orangeci_test_env/blob/master/env引入为环境变量进行使用，env文件内容如下：

  

   ```

       CCR_DOCKER_USER=*******

       CCR_DOCKER_PWD=*******

   ```

  

7. 编写Dockerfile：docker build更加目录下的Dockerfile进行镜像的构建，Demo如下：

  

   ```dockerfile

   FROM node

   LABEL maintainer="mengyaocui@tencent.com"

   COPY ./dist/ /dist/

   COPY ./server/ /server/

   WORKDIR /server

   RUN npm install --registry=http://r.tnpm.oa.com express

   EXPOSE 80

   CMD node server.js

   ```

  

8. 执行git push，开始项目自动构建，生成镜像并推送。企业微信中收到构建成功消息，以及镜像仓库中增加镜像版本，表示构建成功并已经推送到镜像仓库中。

  

   ![构建成功企业微信消息](https://main.qcloudimg.com/raw/2674f9e1b70573dad68f2cb77de2e320.png)

  

   ![镜像构建成功](https://main.qcloudimg.com/raw/dda7415ce36fe2064990f729ecbc53d7.png)

  

9.

  

### 四、容器部署

  

1. 新建工作负载，选择Deployment类型即可满足demo需求

  

   ![新建deployment](https://main.qcloudimg.com/raw/b9169d01361f608401058060dbaeff27.png)

  

2. 配置工作负载（Workload）

  

   - 输入工作负载名，选择命名空间，选择类型为Deployment，输入实例内容器名称，选择镜像；

  

   ![配置工作负载1](https://main.qcloudimg.com/raw/e15aea749a00ef5464e65ae334bd93c7.png)

  

   - 选择根据Dockerfile生成的镜像作为容器服务镜像。

  

   ![选择镜像](https://main.qcloudimg.com/raw/92329d2cabb7ddacaea4edb65205500a.png)

  

   - 按需选择，此处我们选择实例数量手动调节，可先设置数量为1，后续可调整；选择使用指定节点调度的策略；进行创建。

  

   ![配置工作负载2](https://main.qcloudimg.com/raw/030df250eb035296b5a40b23de520784.png)

  

   - 启用service，服务访问方式选择提供公网访问；填写端口映射；完成Workload创建同时启用service。

  

   ![8ed57e007f71d867f50186ee2a266f](https://main.qcloudimg.com/raw/2d24be5a82e6a7bafeaad98f3db5f215.png)

  

  

3. 部署成功：

  

   - 集群--工作负载--Deployment中看到创建的Deployment：

  

   ![Deployment](https://main.qcloudimg.com/raw/a66643b038533b7aa3a7f030fd4e92ee.png)

  

   - 单击工作负载名称可查看相关信息：包括每个Pod的信息、修订历史（可用于版本回滚）等。

  

   ![负载信息](https://main.qcloudimg.com/raw/92bb79f799cc82a33316157b7ee8f973.png)

  

   - 集群--服务--service中查看集群中service相关信息，可以看到公网ip（服务ip/负载均衡ip），使用公网ip+服务端口进行公网访问:http://106.52.99.143

  

   ![service列表](https://main.qcloudimg.com/raw/39dedcf3f131db6577b2c813ef1d8866.png)

  

   - 单击服务名，可以看到服务的相关信息。

  

   ![服务相关信息](https://main.qcloudimg.com/raw/6b8495f1164455c7f9c559750b38007f.png)

  

4. 使用云解析将ip绑定到域名上。

  

### 五、持续部署

  

使用TKE提供的触发器，实现持续部署。

  

1. 由：镜像仓库--我的镜像--镜像名称--触发器进入镜像仓库触发器页面，单击添加触发器。

  

   ![触发器页面](https://main.qcloudimg.com/raw/0cdb8abab5e84aad8f0f33a1edc328c1.png)

  

2. 配置触发器：选择触发条件为全部触发；选择对应的服务和容器；保存触发器。

  

   ![配置触发器](https://main.qcloudimg.com/raw/6dbc193849d1bfd34e40245364a53da0.png)

  

3. 在release分支对项目代码进行修改后，push，触发器被触发，服务镜像更新。

  

   ![触发器被触发](https://main.qcloudimg.com/raw/5751b5b5b9c20e98717b6470a4bdd665.png)

  

   ![服务更新](https://main.qcloudimg.com/raw/e599adbbea37374f01ca9439785959ae.png)

  

4.

  

## 六、运维

  

1. 更新方案：采用滚动升级，先启动新pod，成功后再删除旧pod。

  

2. 回滚：当升级pod镜像或者相关参数的时候发现问题，可以使用回滚操作回滚到上一个稳定的版本或者指定的版本。路径：集群--集群名称--工作负载--Deployment--Deployment名称--修订历史

  

   ![回滚](C:\Users\mengyaocui\Desktop\图片\2ff090310aaed2fc670d80ecaf50b441.png)

  

3. Pod中断的处理：

  

   Pod 不会消失，直到有人（人类或控制器）将其销毁，或者当出现不可避免的硬件或系统软件错误。

  

   这些不可避免的情况称为应用的非自愿性中断。例如：

  

   - 后端节点物理机的硬件故障

   - 集群管理员错误地删除虚拟机（实例）

   - 云提供商或管理程序故障使虚拟机消失

   - 内核恐慌（kernel panic）

   - 节点由于集群网络分区而从集群中消失

   - 由于节点资源不足而将容器逐出

  

   减轻非自愿中断的方法：

  

   - 确保pod 请求所需的资源，设置集群的告警配置，在资源超过阈值告警。

   - 为了在运行复制应用程序时获得更高的可用性，跨机架或跨区域（如果使用多区域集群）分布应用程序。创建多个Pod(实例)，并通过节点调度策略将实例分布在不同节点上。

  

4. 告警配置：可对集群进行多指标的告警配置。