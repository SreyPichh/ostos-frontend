<template>
  <div
    class="form-group"
    :class="[
      { 'input-group': hasIcon },
      { 'has-danger': error },
      { focused: focused },
      { 'has-label': label || $slots.label },
      { 'has-success': valid === true },
      { 'has-danger': valid === false },
      formClasses,
    ]"
  >
    <slot name="label">
      <label v-if="label" class="form-control-label" :class="labelClasses">
        {{ label }}
        <span v-if="required">*</span>
      </label>
    </slot>

    <div
      v-if="addonLeftIcon || $slots.addonLeft || addonLeftText"
      class="input-group-prepend"
    >
      <span class="input-group-text addon-disabled rounded-left input-border">
        <slot name="addonLeft">
          <i v-if="addonLeftIcon" :class="addonLeftIcon"></i>
          <span v-if="addonLeftText">{{ addonLeftText }}</span>
        </slot>
      </span>
    </div>
    <slot>
      <input
        :value="modelValue"
        v-bind="$attrs"
        v-on="listeners"
        class="form-control pl-2"
        :type="inputType"
        :class="[
          { 'is-valid': valid === true },
          { 'is-invalid': valid === false },
          inputClasses,
        ]"
        aria-describedby="addon-right addon-left"
      />
    </slot>
    <div
      v-if="addonRightIcon || $slots.addonRight || addonRightText"
      class="input-group-append"
    >
      <span class="input-group-text">
        <slot name="addonRight">
          <i v-if="addonRightIcon" :class="addonRightIcon"></i>
          <span v-if="addonRightText">{{ addonRightText }}</span>
        </slot>
      </span>
    </div>
    <slot name="infoBlock"></slot>
    <slot name="helpBlock">
      <div
        class="text-danger invalid-feedback"
        style="display: block"
        :class="{ 'mt-2': hasIcon }"
        v-if="error"
      >
        {{ error }}
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  name: "base-input",
  props: {
    required: {
      type: Boolean,
      description: "Whether input is required (adds an asterix *)",
    },
    valid: {
      type: Boolean,
      description: "Whether is valid",
      default: undefined,
    },
    label: {
      type: String,
      description: "Input label (text before input)",
    },
    error: {
      type: String,
      description: "Input error (below input)",
    },
    formClasses: {
      type: String,
      description: "Form css classes",
    },
    labelClasses: {
      type: String,
      description: "Input label css classes",
    },
    inputClasses: {
      type: String,
      description: "Input css classes",
    },
    inputType: {
      type: String,
      description: "Input type",
    },
    modelValue: {
      type: [String, Number],
      description: "Input value",
    },
    addonRightIcon: {
      type: String,
      description: "Addon right icon",
    },
    addonLeftIcon: {
      type: String,
      description: "Addont left icon",
    },
    addonLeftText: {
      type: String,
      description: "Addont left text",
    },
    addonRightText: {
      type: String,
      description: "Addont right text",
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  computed: {
    listeners() {
      return {
        input: this.updateValue,
        focus: this.onFocus,
        blur: this.onBlur,
      };
    },
    hasIcon() {
      const { addonRight, addonLeft } = this.$slots;
      return (
        addonRight !== undefined ||
        addonLeft !== undefined ||
        this.addonRightIcon !== undefined ||
        this.addonLeftIcon !== undefined ||
        this.addonLeftText !== undefined ||
        this.addonRightText !== undefined
      );
    },
  },
  methods: {
    updateValue(evt) {
      let value = evt.target.value;
      this.$emit("update:modelValue", value);
    },
    onFocus(value) {
      this.focused = true;
      this.$emit("focus", value);
    },
    onBlur(value) {
      this.focused = false;
      this.$emit("blur", value);
    },
  },
};
</script>
<style scoped>
.addon-disabled {
  background-color: #e9ecef;
  opacity: 1;
}

.input-border {
  border: 1px solid #cad1d7;
}
</style>
