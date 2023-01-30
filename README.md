# parking_slips_printer
PSB slips printer for car's parking

## Notes
### === RNBluetoothEscposPrinterModule.java ===
    <!-- @ReactMethod -->
    public void printPic(String base64encodeStr, @Nullable  ReadableMap options) {
        int width = 0;
        int leftPadding = 0;
        if(options!=null){
            width = options.hasKey("width") ? options.getInt("width") : 0;
            leftPadding = options.hasKey("left")?options.getInt("left") : 0;
        }

        //cannot larger then devicesWith;
        if(width > deviceWidth || width == 0){
            width = deviceWidth;
        }

        byte[] bytes = Base64.decode(base64encodeStr, Base64.DEFAULT);
        Bitmap mBitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        int nMode = 0;
        if (mBitmap != null) {
            /**
             * Parameters:
             * mBitmap  要打印的图片
             * nWidth   打印宽度（58和80）
             * nMode    打印模式
             * Returns: byte[]
             */
            byte[] data = PrintPicture.POS_PrintBMP(mBitmap, width, nMode, leftPadding);
            //	SendDataByte(buffer);
            sendDataByte(Command.ESC_Init);
            //sendDataByte(Command.LF);
            sendDataByte(data);
            //sendDataByte(PrinterCommand.POS_Set_PrtAndFeedPaper(30));
            //sendDataByte(PrinterCommand.POS_Set_Cut(1));
            sendDataByte(PrinterCommand.POS_Set_PrtInit());
        }
    }