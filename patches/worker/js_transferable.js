const {
    messaging_deserialize_symbol,
    messaging_transfer_symbol,
    messaging_clone_symbol,
    messaging_transfer_list_symbol,
  } = internalBinding('symbols');
module.exports = {
  kClone: messaging_clone_symbol,
  kDeserialize: messaging_deserialize_symbol,
  kTransfer: messaging_transfer_symbol,
  kTransferList: messaging_transfer_list_symbol,
};
