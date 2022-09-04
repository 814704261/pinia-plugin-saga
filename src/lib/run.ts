type TaskDef = () => Generator

export default function run(taskDef: TaskDef) {

  let task = taskDef()

  let result = task.next();

  (function step() {

    if (result.done) {
      return
    }

    let promise = Promise.resolve(result.value)

    promise
      .then((value) => {
        result = task.next(value)
      })
      .catch((error) => {
        result = task.throw(error)
      })
      .finally(step)

  })()
}