import sys
import usb.core
import time
import datetime

# The wensn WS1381B answers these bRequests
# 1  array of 2 bytes returned
# 2  array of 1 byte returned
# 3 - set mode. array of 1 byte returned
# 4 - read SPL. array of 2 bytes returned
# 5  array of 4 bytes returned

def connect():
    dev = usb.core.find(idVendor=0x16c0, idProduct=0x5dc)
    assert dev is not None
    print(dev)
    #print(hex(dev.idVendor) + ', ' + hex(dev.idProduct))

    return dev

ranges = ["30-80", "40-90", "50-100", "60-110", "70-120", "80-130", "30-130"]
speeds = ["fast", "slow"]
weights = ["A", "C"]
maxModes = ["normal", "max"]
def setMode(dev, range="30-80", speed="fast", weight="A", maxMode="normal"):
    rangeN = ranges[0:4].index(range)
    # For rangeN, setting over USB supports only 2 bits of range (?),
    #   although 7 values (0 to 6) can be set with buttons on unit.
    speedN = speeds.index(speed)
    weightN = weights.index(weight)
    maxModeN = maxModes.index(maxMode)

    print("setMode: range:%s weight:%s speed:%s maxMode:%s" %
          (range, weight, speed, maxMode))
    # Function of bits 6 and 7 is unknown (nothing?)
    wvalue = rangeN | weightN<<3 | speedN<<4 | maxModeN<<5

    dev.ctrl_transfer(0xC0, 3, wvalue, 0, 200)

peak = 0
def readSPL(dev):
    global peak

    ret = dev.ctrl_transfer(0xC0, 4, 0, 10, 200) # wvalue (3rd arg) is ignored
    #print(ret)
    #print(format(ret[1], '#010b'))

    rangeN = (ret[1]&28)>>2 # bits 2,3,4 in ret[1] return rangeN from 0 to 6
    weightN = (ret[1]&32)>>5 # bit 5 in ret[1] return 
    speedN = (ret[1]&64)>>6 # bit 6 in ret[1] return 
    # bit 7 seems to alternate every 1 second?

    dB = (ret[0] + ((ret[1] & 3) * 256)) * 0.1 + 30
    if dB > peak:
        peak = dB
    return(dB, ranges[rangeN], weights[weightN], speeds[speedN])

if __name__ == "__main__":
    dev = connect()
    setMode(dev)

    while True:
        dB, range, weight, speed = readSPL(dev)
        print("%.2f,%s,%s,%s,%s"
              % (dB, range, weight, speed,
                 datetime.datetime.now().strftime('%Y,%m,%d,%H,%M,%S')))
        #print(peak)
        time.sleep(1)



