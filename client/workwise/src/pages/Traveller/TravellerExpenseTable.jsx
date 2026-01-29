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

const TravellerExpenseTable = ({ expenseTableData }) => {

    let sr = 1;
    const flattenedExpenses = expenseTableData.flatMap((expense, expenseIndex) =>
    expense.items.map((item, itemIndex) => ({
        srNo:
        expenseTableData
            .slice(0, expenseIndex)
            .reduce((sum, e) => sum + e.items.length, 0) +
        itemIndex + 1,

        date: new Date(expense.date).toLocaleDateString(),
        itemName: item.itemName,
        amount: item.amount,
        currency: item.currency
    }))
    );


    
  return (
      <div className='text-center flex flex-col gap-6'>
            <p className='text-gray-800 font-semibold text-2xl mt-4'>
                Know your numbers...
              </p>
            <Table className="w-full border border-gray-800 rounded-lg">
                <Thead>
                    <Tr className="bg-[#f0ccb8]">
                        <Th className="p-2 text-center border border-gray-800">Sr No</Th>
                        <Th className="p-2 text-center border border-gray-800">Date</Th>
                        <Th className="p-2 text-center border border-gray-800">Currency</Th>
                        <Th className="p-2 text-center border border-gray-800">Item Name</Th>
                        <Th className="p-2 text-center border border-gray-800">Amount</Th>
                    </Tr>
                </Thead>

                <Tbody className="bg-[#f3e5d4]">
                    {flattenedExpenses.map((row) => (
                        <Tr key={row.srNo} className="border-t text-center" >
                            <Td className="p-2 border border-gray-800">{row.srNo}</Td>
                            <Td className="p-2 border border-gray-800">{row.date}</Td>
                            <Td className="p-2 border border-gray-800">₹ {row.currency}</Td>
                            <Td className="p-2 border border-gray-800">{row.itemName}</Td>
                            <Td className="p-2 border border-gray-800">₹ {row.amount}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
    </div>
  )
}

export default TravellerExpenseTable
