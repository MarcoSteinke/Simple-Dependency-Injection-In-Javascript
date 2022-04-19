// initialize an application context
const applicationContext = new Map()

// create any class for this example
class Car {
  brand

  constructor(brand){ this.brand = brand }

  getBrand() { return this.brand }
}

// initialize a bean for the 'Car'-type
let bean = new Car("BMW")

// implement a method, which puts an instance of a bean in the application context by the bean's constructor name
const createBean = bean => applicationContext.set(bean.constructor.name, bean)

// finally add the bean to the application context
createBean(new Car("BMW"))

// now methods can be "annotated" for the injection, by adding inject(PARAMETER_TYPE_AS_STRING) to the parameter
// This is also inspired by Google Guava (and Spring)
function printCar(car = inject('Car')) {
  console.log(car)
}

// The inject method implementation:
function inject(type) {
  if(applicationContext.has(type)) return applicationContext.get(type)
  else throw new Error(`No qualified bean found for the type ${type}`)
}

// If you now execute the following method call, you will see the parameter is printed:
printCar(new Car('VW'))
// => {brand: 'VW'}

// If you now execute the following method call without any parameter, the bean will be injected instead:
printCar()
// => {brand: 'BMW'}

// If you annotate a parameter with "inject", which has no configured bean, an error will be thrown:
inject('ThisTypeDoesNotExist')
// => VM2254:3 Uncaught Error: No qualified bean found for the type ThisTypeDoesNotExist
//  at inject (<anonymous>:3:14)
//  at <anonymous>:1:1

// Another example for a non-existing bean:
function square(number = inject('Number')) {
  return number ** 2
}
// => VM2254:3 Uncaught Error: No qualified bean found for the type Number
//  at inject (<anonymous>:3:14)
//  at <anonymous>:1:1
