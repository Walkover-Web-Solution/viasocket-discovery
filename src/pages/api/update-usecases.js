import { getUsecasesToMergeComments, updateUsecaseUsingComments } from "@/services/usecaseServices";
import { sendMessageTochannel } from "@/utils/utils";

export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'POST':
            let failedUsecases = [];
            let successUsecases = [];
            try {
                res.status(200).json({status:"success"})   // send immediate res
                const usecases = await getUsecasesToMergeComments(environment);

                const commentsResults = await Promise.allSettled(usecases.map(async (usecase) => {
                 await updateUsecaseUsingComments(usecase._id, environment);
                }));

                commentsResults.forEach((result, index) => {
                  if (result.status === 'fulfilled') {
                    successUsecases.push(usecases[index]._id);
                  } else {
                    failedUsecases.push({
                      id: usecases[index]._id,
                      reason: result.reason.message
                    });
                  }
              });

            } catch (error) {
                console.error("error in update usecases of usecases ", error)
                sendMessageTochannel({"message":'error in update usecases .' , error : error.message})

            }finally{
                sendMessageTochannel({"message":`update usecases complete ${successUsecases.length} usecases updated , ids:- ${successUsecases} ` , failedUsecases : failedUsecases})
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
