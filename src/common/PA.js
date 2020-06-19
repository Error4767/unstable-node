export default function PA(promise) {
  return promise.then(r=> [null, r], e=> [e, null]);
}