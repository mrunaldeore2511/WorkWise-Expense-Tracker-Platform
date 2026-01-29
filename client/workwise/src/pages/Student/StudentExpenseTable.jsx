import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "react-super-responsive-table";
import React from 'react'

const StudentExpenseTable = ({ expenseTableData }) => {

    let idx = 1;
    const flattenedExpenses = expenseTableData.flatMap((expense, expenseIndex) =>
        expense.items.map((item) => ({
            srNo: idx++,
            date: new Date(expense.date).toLocaleDateString(),
            itemName: item.itemName,
            amount: item.amount,
            
        }))
    );

    if (!flattenedExpenses.length) {
        return (
            <p className="text-center text-gray-500 mt-4">
                No expenses found for selected dates
            </p>
        );
    }

    return (
        <div className="mt-6 overflow-x-auto p-4">
            <Table className="w-full border border-gray-800 rounded-lg">
                <Thead>
                    <Tr className="bg-[#f0ccb8]">
                        <Th className="p-2 text-center border border-gray-800">Sr No</Th>
                        <Th className="p-2 text-center border border-gray-800">Date</Th>
                        <Th className="p-2 text-center border border-gray-800">Item Name</Th>
                        <Th className="p-2 text-center border border-gray-800">Amount</Th>
                    </Tr>
                </Thead>

                <Tbody className="bg-[#f3e5d4]">
                    {flattenedExpenses.map((row) => (
                        <Tr key={row.srNo} className="border-t text-center" >
                            <Td className="p-2 border border-gray-800">{row.srNo}</Td>
                            <Td className="p-2 border border-gray-800">{row.date}</Td>
                            <Td className="p-2 border border-gray-800">{row.itemName}</Td>
                            <Td className="p-2 border border-gray-800">₹ {row.amount}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </div>
    )
}

export default StudentExpenseTable
