import Configs from "../../config/Configs";

export default function HtmlRender(data) {

    let view = `<html>
    <body>
        <div>Order# : ${data.data?.odid}</div>
        <div><b>Customer Details</b></div>
        <div>Name : ${data.data?.customer_name}</div>
        <div>Mobile Number : ${data.data?.customer_mobile}</div>
        <div>Email : ${data.data?.customer_email}</div>
        <div>GST : ${data.data?.customer_gstin}</div>
        <hr>
        <table width="100%">
       `;
       data.event_games?.forEach(item => {
          view+=`
          <tr>
                <td>
                    <div>${item.game_name}</div>
                    <div>${item.quantity} Quantity</div>

                </td>
                <td>
                    <div>Rent</div>
                    <div>₹ ${item.total_amount}</div>
                </td>
        </tr>`; 
       });


       view+=`</table>
       <hr>
       <table  width='100%''>
           <tr>
               <td>
                  <b>Sub Total :</b>
               </td>
               <td>
                  <b> ₹ ${data.sub_total} </b>
               </td>
           </tr>

           <tr>
               <td>
                   Transport Charges
               </td>
               <td>
               ₹ ${data.transport}
               </td>
           </tr>

           <tr>
               <td>
                   Installation Charges:
               </td>
               <td>
               ₹ ${data.installation}
               </td>
           </tr>

           <tr>
               <td>
                   Additional Charges:
               </td>
               <td>
               ₹ ${data.additional}
               </td>
           </tr>
           <tr>
               <td>
                   GST 18%:
               </td>
               <td>
               ₹ ${data.gst}
               </td>
           </tr>

           <tr>
               <td>
                   Discount:
               </td>
               <td>
               ₹ ${data.discount}
               </td>
           </tr>

           <tr>
               <td>
                   <b>Total Amount: </b>
               </td>
               <td>
                   <b>₹ ${data.total_amount}</b>
               </td>
           </tr>
       </table>
   </body>
</html>`;

    return view;
}