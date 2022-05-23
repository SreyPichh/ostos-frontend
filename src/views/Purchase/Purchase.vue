<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>
  <div class="container-fluid mt--7">
    <!--Tables-->
    <div class="row mt-5">
      <div class="col-xl-12 mb-5 mb-xl-0">
        <purchase-table></purchase-table>
      </div>
    </div>
    <!--End tables-->
  </div>
</template>

<script>
// @ is an alias to /src
import PurchaseTable from "./PurchaseTable";

export default {
  name: "purchase",
  components: { PurchaseTable },
};
</script>
