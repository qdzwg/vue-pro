<template>
    <div class="no-page">
        <div class="error">404</div>
    </div>
</template>
<script>
export default {
    data(){
    },
    mounted(){
    }
}
</script>

<style lang='scss' scoped>
 .no-page{
     margin-top: 200px;
     position: relative;
     .error{
         font-size: 50px;
         position:absolute;
         top:50%;
         left:50%;
         transform: translate(-50%,-50%)
     }
 }
</style>

