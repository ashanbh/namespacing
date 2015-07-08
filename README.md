# namespacing
A Basic Namespacing implementation 

## Background
While AMD & commonJS are great for dyamically including code in your application, i like my code to be structured like a tree. I.e. I want one central global object with a deeply nested tree of children. As you go down the tree, the modules get smaller and more specific. 

  e.g. Asssume you are writing a dog-walking app called "WAG", i would want your object Heiracrhy to look roughly like this

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
You should also ideally structure your code to look like the structire below. These files can be combined at compile time using a minification library.

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

All models in one directory. Submodels of parent models in child folders. That is easy to do. 
<script src="js/namespace.js"></script>

<script>
    write("<h2>No Namespacing</h2>")
    myFunction();
    myHoistyFunction();
    myErroneousFunction();

    write("<h2/><h2>With Namespacing</h2>");
</script>

<!--script>
    require.config({
        baseUrl: "js/"
    });
    requirejs(['namespace'], function (namespace) {
        namespace.init("HELLOWROLD");
    });
</script-->

<script>
    namespace.init("Hello");
    namespace("World")
    write(Hello);
    write(Hello.World);
</script>

<script>

    namespace("Hello.Country.State.Model");
    (function (ns) {
        ns.getData = function () {
            return "Some state data"
        }
    })(Hello.Country.State.Model);


    namespace("Hello.Country.State.City.Model");
    (function (ns) {
        ns.getData = function () {
            return "Some city data"
        }
    })(Hello.Country.State.City.Model);


    namespace("Hello.Country.State.City.Controller");
    (function (ns) {
        ns.handleClicks = function () {
            return "Handling CLick for this Data:" + Hello.Country.State.City.Model.getData()
        }
    })(Hello.Country.State.City.Controller);


    namespace("Hello.Country.State.City.View");
    (function (ns) {
        ns.print = function () {
            return "<em>" + Hello.Country.State.City.Model.getData() + "</em>"
        }
    })(Hello.Country.State.City.View);

    write("Hello.Country.State.Model.getData()", Hello.Country.State.Model.getData());
    write("Hello.Country.State.City.Model.getData()", Hello.Country.State.City.Model.getData());
    write("Hello.Country.State.City.Controller.handleClicks()", Hello.Country.State.City.Controller.handleClicks());
    write("Hello.Country.State.City.View.print()", Hello.Country.State.City.View.print());

    write("<h2>The Namespace tree</h2>", Hello);
</script>


<script>
    namespace("Hello.Animals");
    (function (ns) {
        ns.areEdible = function () {
            return true;
        }
        ns.usePhotoSynthesis = "maybe"; //http://www.iflscience.com/plants-and-animals/sea-slug-steals-photosynthesis-genes-its-algae-meal
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

