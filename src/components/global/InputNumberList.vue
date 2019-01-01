<template>
  <div>
    <ul class="number-input-list">
      <li v-for="(item,index) in numberLen">
        <div>
          <InputNumber inputType="password" :maxLen="maxLen" @handleNumberChange="(e)=>{
            handleNumberChange(e,index)
          }" @deleteNumber="(e)=>{
            deleteNumber(e,index)
          }" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import InputNumber from './InputNumber'
export default {
  components: {
    InputNumber
  },
  props: ['numberLen'],
  data() {
    return {
      maxLen: 1
    }
  },
  methods: {
    handleNumberChange(e, index) {
      if (
        e.target.value.length === this.maxLen &&
        index !== this.numberLen - 1
      ) {
        let nextInput = document
          .querySelector('.number-input-list')
          .children[index + 1].querySelector('input')
        nextInput.focus()
        e.target.setAttribute('type', 'password')
      }
      this.getInputValList()
    },
    deleteNumber(e, index) {
      if (!e.target.value && index !== 0) {
        let lastInput = document
          .querySelector('.number-input-list')
          .children[index - 1].querySelector('input')
        // lastInput.setAttribute('type', 'number')
        lastInput.focus()
      }
    },
    getInputValList() {
      let result = []
      let inputList = document.querySelector('.number-input-list').children
      for (var i = 0; i < inputList.length; i++) {
        result.push(inputList[i].querySelector('input').value)
      }
      let filteredResult = _.compact(result)
      this.$emit('change', filteredResult)
    }
  }
}
</script>

<style scoped>
.number-input-list {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
}
.number-input-list input {
  border: solid 0.8px #e2e4ef;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  margin-right: 10px;
  background-color: #f9fafe;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}

.number-input-list > li:last-child > div > input {
  margin-right: 0;
}

@media (max-width: 320px) {
  .number-input-list input {
    width: 25px;
    height: 25px;
  }
}
</style>
