export const toggle = {
  data() {
    return {
      isshow: false,
    };
  },
  methods: {
    toggleview() {
      console.log('混合中taggleview');
      this.isshow = !this.isshow;
    },
  },
  mounted() {
    console.log('*********************混合Mixins中的钩子-mounted');
  },
};
