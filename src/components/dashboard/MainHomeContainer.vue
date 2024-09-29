<template>
    <!-- Summary Report Container -->
    <div class="flex flex-col flex-[2] gap-1 bg-pure-white border-4 border-main-gray rounded-xl p-2">
        <!-- Title -->
        <div class="w-full h-auto">
            <h1 class="text-xl font-bold text-custom-orange">Summary Report</h1>
        </div>
        

        <!-- Bento Box Parent -->
        <div class="w-full h-full flex-1 flex flex-col gap-2">
            <!-- Top -->
            <div class="w-full h-full  flex-1 flex flex-col lg:flex-row justify-evenly gap-2">

                <!-- Total Ticket Volume -->
                <div class="flex-1 bg-sky-100 p-2">
                    <p class="text-[.80rem] xl:text-sm font-semibold">Total Ticket Volume</p>

                </div>
                <!-- Total Volume Today -->
                <div class="flex-1 bg-yellow-100 p-2 ">
                     <p class="text-[.80rem] xl:text-sm font-semibold">Total Volume Today</p>

                </div>
                <!-- Pending Ticket Today -->
                <div class="flex-1 bg-teal-700 p-2 font-semibold">
                    <p class="text-[.80rem] xl:text-sm font-semibold">Pending Ticket Today</p>
                </div>

            </div>

            <!-- Bottom -->
            <div class="w-full h-full flex flex-col lg:flex-row gap-2 flex-[3] bg-blue ">

                <!-- Left -->
                <div class="flex-1 flex flex-col gap-2">
                    <!-- Abandonment Rate -->
                    <div class="flex-1 bg-red-300 p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Abandonment Rate</p>
                    </div>
                    <!-- Abandonment Count Today -->
                    <div class="flex-1 bg-red-300 p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Abandonment Count Today</p>
                    </div>
                </div>

                <!-- Right -->
                <div class="w-full h-full flex flex-col gap-2 flex-[3]">
                    <div class="flex-1 bg-sky-100 p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Waiting Time</p>
                    </div>
                    <div class="flex-1 bg-yellow-100 p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Serving Time</p>
                    </div>
                    <div class="flex-1 bg-teal-700 p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Resolution Time</p>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Feedback Container -->
    <div class="flex flex-[1] bg-pure-white border-4 border-main-gray rounded-xl p-2">

    </div>
</template>