import sys
import usb.core
import time
import datetime

def connectWensn():
    dev = usb.core.find(idVendor=0x16c0, idProduct=0x5dc)
    assert dev is not None
    print(dev)
    #print(hex(dev.idVendor) + ', ' + hex(dev.idProduct))

    return dev

def setMode(dev, range="30-80", speed="fast", weight="A", maxMode="normal"):
    rangeN = ["30-80", "40-90", "50-100", "60-110"].index(range)
    speedN = ["fast", "slow"].index(speed)
    weightN = ["A", "C"].index(weight)
    maxModeN = ["normal", "max"].index(maxMode)

    print("setMode: range:%s weight:%s speed:%s maxMode:%s" %
          (range, weight, speed, maxMode))
    wvalue = rangeN | weightN<<3 | speedN<<4 | maxModeN<<5

    dev.ctrl_transfer(0xC0, 3, wvalue, 0, 200)

peak = 0
def readSPL(dev):
    global peak

    ret = dev.ctrl_transfer(0xC0, 4, 0, 0, 200)
    dB = (ret[0] + ((ret[1] & 3) * 256)) * 0.1 + 30
    if dB > peak:
        peak = dB
    return(dB)

if __name__ == "__main__":
    dev = connectWensn()
    setMode(dev)

    while True:
        dB = readSPL(dev)
        print("%.2f,%s" % (dB,
                           datetime.datetime.now().strftime('%Y,%m,%d,%H,%M,%S')))
        #print(peak)
        time.sleep(1)



