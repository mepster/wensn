
** Install required python library:

pip3 install pyusb


** Setting permissions for the usb device:

If you can run as root:
 sudo python3 wensn.py

but running as your own user::
 python3 wensn.py

fails with with error, "usb.core.USBError: [Errno 13] Access denied (insufficient
permissions)", that means you have to fix your device permissions.

To do this, create a file called
"/etc/udev/rules.d/50-usb-perms.rules". The file has to end in
".rules" to be read.

Add this rule to the file:
SUBSYSTEM=="usb", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05dc", GROUP="plugdev", MODE="0660"

then run:
sudo udevadm control --reload ; sudo udevadm trigger

Make sure your user is in group plugdev:
groups [your user name]

After you plug in your device, you can check the permissions with:
$ ls -l /dev/bus/usb/001/023
crw-rw---- 1 root plugdev 189, 23 Aug 16 00:38 /dev/bus/usb/001/023

(Replace /dev/bus/usb/001/023 with your device path; that was mine. It
changes every time you plug in the usb device. You can find it by
seeing which new file appears when you plug in the device.)

That means group plugdev can "rw" the device, and I am in that group, so it works.

You can test which rules are being applied with:
udevadm test $(udevadm info -q path -n /dev/bus/usb/001/023)

 ...that's how I finally figured out that my file wasn't being read,
and that it needed to end in ".rules" (someone had specified a file
ending with ".conf" in their instructions - won't work).!


** Install the service so it runs after reboot:
sudo cp wensn.service /etc/systemd/system
sudo systemctl enable wensn.service
sudo systemctl start wensn.service

You can check that it's active with:
systemctl status shutdown_button.service

The service runs as user pi (not root), so you have to get the device
permissions right. Or you can change the service to run as root, but
this is generally not a great security practice. (Someone who managed
to log in as you could replace the python script with their own
malicious script, and it would get run as root... anyway it's possible.)

