# 两种常见的CSS预处理器

## Sass/Scss
> Sass: 诞生于2007年，最早也是最成熟的一款CSS预处理器语言。可以使用常量、变量、函数、混入、函数等功能，最后会编译成合法的CSS让浏览器使用。
### Sass和Scss的区别
Scss是Sass的子集，他们采用两套语法规则
- 使用缩紧作为分隔符来区分代码块
- 和CSS一样采用大括号({})作为分隔符
后一种语法规则称为SCSS, 在Sass3之后的版本都支持这种语法规则。
## Less
> Less: 2009年开源，受Sass影响较大，但使用CSS语法。


## 语法
> 因为Scss 和 Less用法大同小异，下面只使用Scss作为演示

### 变量（variables）
```scss
$base-color: #c6538c;
$border-dark: rgba($base-color, 0.88);

.alert {
  border: 1px solid $border-dark;
}
```

### 嵌套（nested rules）
```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
```

###  混合（mixins）
```scss
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

@mixin horizontal-list {
  @include reset-list;

  li {
    display: inline-block;
    margin: {
      left: -2px;
      right: 2em;
    }
  }
}

nav ul {
  @include horizontal-list;
}
```
### 函数（functions）
```scss
@use "sass:color";

.button {
  $primary-color: #6b717f;
  color: $primary-color;
  border: 1px solid color.scale($primary-color, $lightness: 20%);
}
```
具体使用：[Sass函数使用](https://www.sasscss.com/documentation/modules#:~:text=Sass%20provides%20the,Sass%E2%80%99s%20inner%C2%A0workings.)



# Style-Components
## 前言
Style-Components是React实现CSS-in-JS的一种方式，类似的Vue中的scope也是这个思想。

## 什么是CSS-in-JS
简单说：使每个组件都有它的scopeId，样式进行绑定，避免当项目是多人协作，可能存在的命名冲突问题。

## 如何使用
```js
yarn add styled-components -D;
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;
render(
  <div>
    <Button>Normal</Button>
    <Button primary>Primary</Button>
  </div>
);
```