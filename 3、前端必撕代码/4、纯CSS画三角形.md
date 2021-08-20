```css
/**纯CSS画三角形*/
.triangle{
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #44a5fc;
    border-right-color: #44a5fc;
    transform: skew(20deg); /**用来画钝角，使元素在水平方向和垂直方向同时倾斜（X轴和Y轴同时倾斜）*/
    position: absolute; /**定位调节三角形位置*/
    left: 116px;
    top: 26px;
}
```

