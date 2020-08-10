export const toggle =  {
 data() {
   return {
     isshow: false
   }
 },
 methods: {
   toggleview() {
     this.isshow = !this.isshow;
   }
 },
 mounted () {
   console.log('*********************Mixins-mounted')
 },
}