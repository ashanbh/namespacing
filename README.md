# namespacing
A Basic Namespacing implementation 

## Background
While AMD & commonJS are great for dyamically including code in your application, i like my code to be structured like a tree. I.e. I want one central global object with a deeply nested tree of children. As you go down the tree, the modules get smaller and more specific. 

  e.g. Asssume you are writing a dog-walking app called "WAG", your object heiracrhy should look roughly like this

```
    WAG
    |-Models
        |-DogWalker
            |-PartTime
            |-FullTime
        |-Dog
        |-DogParent
    |-Views
        |-DogWalker
        |-Dog
        |-DogParent    
    |-Controllers
        |-DogWalker
        |-Dog
        |-DogParent    
    |-Utils
```

You should also ideally structure your code to look like below. These files can be combined at compile time using a minification library.
```
    /wag
        /models
            /dogWalker
                /modelDogWalkerPartTime.js
                /modelDogWalkerFullTime.js
            /modelDog.js
            /modelDogParent.js
    /Views
          /viewDogWalker.js
          /viewDog.js
          /viewDogParent.js    
    /Controllers
          /controllersDogWalker.js
          /controllersDogWalkerDog.js
          /controllersDogWalkerDogParent.js    
    /utils.js
```

##Include the lib
The usage of namespace.js is simple. Include it as script file
```html
<script src="js/namespace.js"></script>
```

or include it using AMD
```html
<script src="lib/require.js"></script>
<script>
    require.config({
        baseUrl: "js/"
    });
    requirejs(['namespace'], function (namespace) {
        namespace.init("HELLOWROLD");
    });
</script>
```

##Initialization
Either way you will have a global object called **namespace**
You must call **namespace.init** to setup the root namespace for your app
```javascript
<script>
    namespace.init("WAG");
</script>
```

Attempts to re-initializing the namespace will cause errors
```html
<script>
    namespace.init("WAG");
    namespace.init("HAB"); //ERROR!
</script>
```

##Simple Example
Now you can partition your code into separate files and start adding functionality
```html
<script src="wag-model-dog.js"></script>
<script src="wag-model-dogParent.js"></script>
```
which in turn included the following code
```javascript
    namespace("WAG.Model.Dog");
    (function (ns) {
        ns.getData = function () {
            return "Dog"
        }
    })(WAG.Model.Dog);


    namespace("WAG.Model.DogParent");
    (function (ns) {
        ns.getData = function () {
            return "DogParent
        }
    })(WAG.Model.DogParent);
```


##Understanding Inheritance
Lets exampine the following code
```javascript

    namespace("Hello.Animals");
    (function (ns) {
        ns.areEdible = function () {
            return true;
        }
        
        //http://www.iflscience.com/plants-and-animals/sea-slug-steals-photosynthesis-genes-its-algae-meal
        ns.usePhotoSynthesis = "maybe"; 

    })(Hello.Animals);


    namespace("Hello.Animals.Cats").extend(Hello.Animals);
    (function (ns) {
        ns.areEdible = function () {
            return false
        }
        ns.canBark = false
    })(Hello.Animals.Cats);


    namespace("Hello.Animals.Dogs").extend(Hello.Animals);
    (function (ns) {
        ns.areEdible = function () {
            return "Can we call Super ?:"+ns.parent().areEdible() + ns.parent('areEdible')();
        }
        
        ns.canBark = true
    })(Hello.Animals.Dogs);


    namespace("Hello.Animals.Snails").extend(Hello.Animals);
    
```
    
One namespace can extend another namespace using 
```javascript
namespace("Hello.Animals.Dogs").extend(Hello.Animals)
```
or
```javascript
namespace("Hello.Animals.Dogs");
Hello.Animals.Dogs.extend(Hello.Animals)
```

Objects and methods have access to their parent, using the **parent()** function
```
namespace("Hello.Animals.Dogs").extend(Hello.Animals);
    (function (ns) {
        ns.areEdible = function () {
            return "Can we call Super ?:"+ns.parent().areEdible() + ns.parent('areEdible')();
        }
           
        ns.canBark = true
    })(Hello.Animals.Dogs);
    
    
    //ns.parent().areEdible === ns.parent('areEdible') === true
```



So, executing the peice of script below
```javascript
    write("<h2>Extension of Namespaces</h2>");
    write("Cats Are edible?", Hello.Animals.Cats.areEdible());
    write("Dogs Are edible?", Hello.Animals.Dogs.areEdible());
    write("Snails Are edible?", Hello.Animals.Snails.areEdible())
    write("Cats:", Hello.Animals.Cats);
    write("Dogs:", Hello.Animals.Dogs)
    write("Snails:", Hello.Animals.Snails);
    write("Animals:", Hello.Animals);
    write("Animals' children's names:", Hello.Animals.getChildren().map(function(o){return o.getNSName()}));
    write("Animals' children", Hello.Animals.getChildren());
```

Will produce the output:
```
Cats Are edible? false
Dogs Are edible? Can we call Super ?:truetrue
Snails Are edible? true
Cats:
{
    "isNamespace": true,
    "usePhotoSynthesis": "maybe",
    "canBark": false
}

Dogs:
{
    "isNamespace": true,
    "usePhotoSynthesis": "maybe",
    "canBark": true
}

Snails:
{
    "isNamespace": true,
    "usePhotoSynthesis": "maybe"
}

Animals:
{
    "isNamespace": true,
    "usePhotoSynthesis": "maybe",
    "Cats": {
        "isNamespace": true,
        "usePhotoSynthesis": "maybe",
        "canBark": false
    },
    "Dogs": {
        "isNamespace": true,
        "usePhotoSynthesis": "maybe",
        "canBark": true
    },
    "Snails": {
        "isNamespace": true,
        "usePhotoSynthesis": "maybe"
    }
}

Animals' children's names:
[
    "Hello.Animals.Cats",
    "Hello.Animals.Dogs",
    "Hello.Animals.Snails"
]

Animals' children
[
    {
        "isNamespace": true,
        "usePhotoSynthesis": "maybe",
        "canBark": false
    },
    {
        "isNamespace": true,
        "usePhotoSynthesis": "maybe",
        "canBark": true
    },
    {
        "isNamespace": true,
        "usePhotoSynthesis": "maybe"
    }
]
```



    

