export const toggle =  {
 data() {
   return {
     isshow: false
   }
 },
 methods: {
   toggleview() {
     console.log('ccccc')
     this.isshow = !this.isshow;
   }
 },
 mounted () {
   console.log('*********************Mixins-mounted')
 },
}