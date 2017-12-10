Path=C:\Program Files\Git\bin;F:\git\curl-7.57.0\AMD64

git pull

git add -A

git commit -a -m "Auto Commit"

git push

# token = ToQ9uvUPmLpH6M_zzXZD
# app = 2912599
# ?auth_token=ASTRINGTOKEN

curl -X POST -d '' https://build.phonegap.com/api/v1/apps/2912599/build/android?auth_token=ToQ9uvUPmLpH6M_zzXZD


set /P var="finish"