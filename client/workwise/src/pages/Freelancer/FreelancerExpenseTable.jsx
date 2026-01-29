import React from 'react'
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "react-super-responsive-table";
const FreelancerExpenseTable = ({ expenseTableData, expenseTableAmount }) => {

    const flattenedExpenses = expenseTableData.map((item, index) => ({
        srNo: index + 1,
        itemName: item.itemName,
        date: new Date(item.date).toLocaleDateString(),
        amount: item.amount,
        gst: item.gst
    }));


    if (!flattenedExpenses.length) {
        return (
            <p className="text-center text-gray-500 mt-4">
                No expenses found for selected dates
            </p>
        );
    }
return (
  <div className="mt-6 overflow-x-auto p-4 w-full">

    {/* Summary Section */}
    <div className="flex flex-col md:flex-row flex-wrap items-center justify-center md:justify-between gap-6 md:px-10 mb-6 text-center font-semibold text-xl">

      <div className="flex flex-col items-center gap-2">
        <label htmlFor="totalAmount" className="whitespace-nowrap">
          Total Amount
        </label>
        <input
          id="totalAmount"
          type="number"
          disabled
          value={expenseTableAmount.totalAmount ?? 0}
          className="p-2 rounded-lg bg-[#C5D89D] border w-28 text-center"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <label htmlFor="baseAmount" className="whitespace-nowrap">
          Base Amount
        </label>
        <input
          id="baseAmount"
          type="number"
          disabled
          value={expenseTableAmount.baseAmount ?? 0}
          className="p-2 rounded-lg bg-[#C5D89D] border w-28 text-center"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <label htmlFor="totalGST" className="whitespace-nowrap">
          Total GST
        </label>
        <input
          id="totalGST"
          type="number"
          disabled
          value={expenseTableAmount.totalGST ?? 0}
          className="p-2 rounded-lg bg-[#C5D89D] border w-28 text-center"
        />
      </div>

    </div>

    {/* Table */}
    <div className="w-full overflow-x-auto">
      <Table className="w-full min-w-160 border border-gray-800 rounded-lg text-sm md:text-base">
        <Thead>
          <Tr className="bg-[#f0ccb8]">
            <Th className="p-2 text-center border border-gray-800">Sr No</Th>
            <Th className="p-2 text-center border border-gray-800">Date</Th>
            <Th className="p-2 text-center border border-gray-800">Item Name</Th>
            <Th className="p-2 text-center border border-gray-800">Amount</Th>
            <Th className="p-2 text-center border border-gray-800">GST(%)</Th>
          </Tr>
        </Thead>

        <Tbody className="bg-[#f3e5d4]">
          {flattenedExpenses.map((row) => (
            <Tr key={row.srNo} className="border-t text-center">
              <Td className="p-2 border border-gray-800">{row.srNo}</Td>
              <Td className="p-2 border border-gray-800">{row.date}</Td>
              <Td className="p-2 border border-gray-800 wrap-break-words">
                {row.itemName}
              </Td>
              <Td className="p-2 border border-gray-800">₹ {row.amount}</Td>
              <Td className="p-2 border border-gray-800">₹ {row.gst * 100}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  </div>
);

}

export default FreelancerExpenseTable
