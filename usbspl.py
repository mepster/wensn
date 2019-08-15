# use this program to enumerate active USB device output addresses on the Control Endpoint
# this is one of the early steps in reverse-engineering capabilities

import sys
import usb.core
import time 

dev = usb.core.find(idVendor=0x16c0, idProduct=0x5dc)

assert dev is not None

#print(dev)
#print(hex(dev.idVendor) + ', ' + hex(dev.idProduct))

for bRequest in range(83):
    try:
        ret = dev.ctrl_transfer(0xC0, bRequest, 0, 0, 100)
        if ret[0] != None:
            print("bRequest ", bRequest, ret)
    except:
        pass
