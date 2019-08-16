
# Reading the Wensn WS1361 Sound Pressure Level (SPL) Meter over USB (on the Raspberry Pi)

The Wensn WS1361 is a cheap but decent quality Sound Level Meter from China. You can get it on Aliexpress for $25-30, for example here: https://www.aliexpress.com/item/32328084637.html Make sure you get the one with the USB cable.

![WS1361](https://github.com/mepster/wensn/blob/master/WS1361.png)

This Python (3) library lets you set the modes of the WS1361, and read the current sound level.

The WS1361 can read with 'A' or 'C' sound weighting, and 'fast' or 'slow' averaging. The library uses the default of 'A' and 'slow'.

You can also set the "range". This does change the range shown on the device display, but doesn't change the sound levels returned over USB. Similarly, you can set the "maxMode" to "max" or "instant", which also changes what is shown on the device display (e.g., "max" mode shows the running peak value), but doesn't change the sound levels returned over USB.

## Installation:

```
pip3 install pyusb
```

and run:

```
python3 wensn.py
```

## Setting permissions for the usb device:

If you find that running as your own user fails with with error, "usb.core.USBError: [Errno 13] Access denied (insufficient
permissions)", that means you have to fix your device permissions.

To do this, create a file called
"/etc/udev/rules.d/50-usb-perms.rules". The file has to end in
".rules" to be read.

Add this rule to the file:
```
SUBSYSTEM=="usb", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05dc", GROUP="plugdev", MODE="0660"
```

then run:
```
sudo udevadm control --reload ; sudo udevadm trigger
```

Make sure your user is in group plugdev:
```
groups [your user name]
```

After you plug in your device, you can check the permissions with:
```
$ ls -l /dev/bus/usb/001/023
crw-rw---- 1 root plugdev 189, 23 Aug 16 00:38 /dev/bus/usb/001/023
```

(Replace /dev/bus/usb/001/023 with your device path; that was mine. It
changes every time you plug in the usb device. You can find it by
seeing which new file appears when you plug in the device.)

That means group plugdev can "rw" the device, and I am in that group, so it works.

You can test which rules are being applied with:
udevadm test $(udevadm info -q path -n /dev/bus/usb/001/023)

(That's how I finally figured out that my file wasn't being read, because it didn't end in ".rules".)

## Alternative to setting device permissions: run as root
If you don't want to bother setting the device permissions, you can run as root:
```
sudo pip3 install pyusb
```
```
sudo python3 wensn.py
```
but this is generally not a great security practice.

## Install the service so it runs after reboot:

Check out the wensn.service file and adjust the WorkingDirectory, and the path in ExecStart for your setup. If you are not on a Raspberry Pi and running as the default user (pi), you should also adjust the User. Then install the service:

```
sudo cp wensn.service /etc/systemd/system
sudo systemctl enable wensn.service
sudo systemctl start wensn.service
```

You can check that it's active with:
```
systemctl status shutdown_button.service
```

The service runs as user pi (not root), so you have to get the device
permissions right. Alternatively, you can change the .service file so it runs as root.


## LogRoll
I also include a python class called LogRoll. This class opens a log file so that you can write SPL values to it. If the filename you provide changes, it rolls over to a new log. I include the date and hour, but not the minutes and seconds, in the filename; this way, when the hour changes, the log file rolls over. The result is a set of timestamped ("hourstamped") log files, each containing all the data for a given hour.

## Credits:

Thanks to ebswift, https://www.ebswift.com/reverse-engineering-spl-usb.html
