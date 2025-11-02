export const SuccessResponse = ({
  res,
  statusCode = 200,
  message = "Success Proccess",
  data = {},
}) => {
  return res.status(statusCode).json({ message, data });
};
