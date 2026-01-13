# rhv包引入说明

## 0. 放置rhv目录
建议将rhv包整个文件夹放置于src/app/下，即src/app/rhv如此位置

## 1. 引入rhv.less样式文件
在项目的theme.less或者styles.less中引入rhv/styles/rhv.less文件。<br>
由于rhv.less中包含对ng-zorro样式的重写样式（位于rhv/styles/ng-zorro-override.less），建议在ng-zorro样式文件的后面导入。<br>
参考代码：
``` less
@import("./app/rhv/styles/rhv.less");
```

## 2. 注册rhv携带的assets资源
在项目的angular.json文件中，追加如下代码：
``` json
{
    // 节点位置：(angular.json).projects.rh-visualization.architect.build.opitons.
        "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "./node_modules/@ant-design/icons-angular/src/inline-svg/",
                "output": "/assets/"
              },
              //追加下述配置：
              {
                "glob": "**/*",
                "input": "./src/app/rhv/assets/",
                "output": "/assets/rhv/"
              }
            ],
}
```

## 3. 注册tsconfig中的path
在tsconfig.json文件中添加下述代码以便于使用rhv下的资源：
``` json
{
    "paths": {
        //......
      "@rhv": [
        "src/app/rhv"
      ],
      "@rhv/*": [
        "src/app/rhv/*"
      ]
    }
}


```