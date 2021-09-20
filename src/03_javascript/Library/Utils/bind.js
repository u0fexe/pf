export default function (methods, context) {
  methods = Array.isArray(methods) ? methods : [methods]
  methods.forEach(method => {
    context[method] = context[method].bind(context)
  })
}