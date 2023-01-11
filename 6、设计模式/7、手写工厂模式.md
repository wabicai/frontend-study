> 工厂模式就是使同一类别类综合起来，以使接口统一方便调用，同时在修改以及扩展时更加方便。
>
> 分为三个细分点：简单工厂模式、工厂方法模式、抽象工厂模式

### 简单工厂模式

```js
function factory(type){
    function fruit(option){
        this.name = option.name;
        this.sayName = function(){
            console.log('我是' + option.nameToSay)
        };
    }

    switch(type){
        case 'apple':
            return new fruit({
                name: '苹果',
                nameToSay: '大苹果'
            });
            break;
        case 'banana':
            return new fruit({
                name: '香蕉',
                nameToSay: '大香蕉'
            });
            break;
    }
}

var apple = factory('apple');
apple.sayName(); // "我是大苹果"
```

## 工厂方法模式

> 工厂方法模式跟简单工厂模式差不多，但是把具体的产品放到了工厂函数的prototype中。这样一来，扩展产品种类就不必修改工厂函数了
>
> factory是一个普通函数，this指向的是全局对象window，于是会执行else中的语句，实例化一个factory并传入type。构造函数实例化后是一个对象，此时this是factory的一个实例，所以会执行`new this[type]()`，返回一个产品实例。

```js
function factory(type){
    if(this instanceof factory){
        return new this[type]();
    }else{
        return new factory(type);
    }
}

factory.prototype = {
    'apple': function(){
        this.name = '苹果';
        this.sayName = function(){
            console.log('我是苹果');
        }
    },
    'banana': function(){
        this.name = '香蕉';
        this.sayName = function(){
            console.log('我是香蕉');
        }
    }
}
var apple = factory('apple')
```

## 抽象工厂模式

> 抽象类就是存在**仅定义，并没有真正实现**的方法的类。

```js
var factory = function(subType, supType){
    if(typeof factory[supType] === 'function'){
        // 如果让subType.prototype直接指向supType
        // 那么对subType.prototype的任何修改都会影响supType
        // 所以借用一个空对象完成继承
        function F(){};
        F.prototype = new factory[supType]();
        subType.prototype = new F();
        // 改变了subType.prototype后，
        // subType.constructor指向了F
        // 但是具体类是由抽象类构造的，
        // 这就导致了subType不能找到正确的constructor
        // 所以必须手动纠正
        subType.constructor = subType;
    }else{
        throw new Error('抽象类不存在');
    }
}

// 定义抽象类
factory.fruitType = function(){
    this.type = '水果';
};
factory.fruitType.prototype = {
    sayName: function(name){
        throw new Error('不能调用抽象方法，请实现该方法');
    }
};

factory.vegetableType = function(){
    this.type = '蔬菜';
};
factory.vegetableType.prototype = {
    sayName: function(name){
        throw new Error('不能调用抽象方法，请实现该方法');
    }
};

// 定义具体类
function fruit(name){
    this.name = name;
}
// 继承
factory(fruit, 'fruitType');
// 实现抽象方法
fruit.prototype.sayName = function(){
    console.log('我是' + this.name);
}

// 实例化水果
var apple = new fruit('苹果');
apple.type; // "水果"
apple.sayName(); // "我是苹果"
```



